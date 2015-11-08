import logging, md5
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json)
from itsdangerous import URLSafeTimedSerializer
from modules import *

user_api = Blueprint('user_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def connectToEssayDB():
  try:
    return engine.connect()
  except:
    print("Can't connect to database")

@user_api.route('/login', methods=['POST'])
def login():
    userEmail = request.form['userLoginEmail']
    userPass = request.form['userLoginPass']
    logger.info(userEmail)
    return (userLogin(userEmail, userPass))
    
@user_api.route('/register', methods=['POST'])
def register():
    userEmail = request.form['reg_email']
    userFirst = request.form['reg_first']
    userLast = request.form['reg_last']
    logger.info(userEmail + " " + userFirst + " " + userLast)
    return (newUser(userEmail, userFirst, userLast))
    
@user_api.route('/logout')
def logout():
    session.clear()
    return jsonify(success='success')
  
@user_api.route('/checkUser')
def checkUser():
    return jsonify(user=session.get('user'))
    
@user_api.route('/pendingUsers')
def getPendingUsers():
    logger.info('getting pending users')
    users = User.query.filter(User.pending==1).all()
    users = [user.serialize for user in users]
    return jsonify(users=users)
    
def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=app.config['SECURITY_PASSWORD_SALT'])


def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = serializer.loads(
            token,
            salt=app.config['SECURITY_PASSWORD_SALT'],
            max_age=expiration
        )
    except:
        return False
    return email
  
def userLogin(email, password):
    dk = md5.new(password).hexdigest()
    logger.info('checking DB for user')
    user = User.query.filter(and_(User.email==email, User.password==dk, User.pending!=1)).all()
    user = [i.serialize for i in user]
    
    if (len(user) != 0):
        logger.info('user found')
        session['user'] = (user[0])
        return jsonify(user=user)
    else:
        logger.info('user not found')
        return jsonify(user=user)
        
def userRegister(email, first, last):
    logger.info('adding user ' + email)
    user = User(email=email, first_name=first, last_name=last, pending=True, account_type_id_fk=2, instr_id_fk=2)
    db_session.add(user)
    db_session.commit()
    logger.info('added user' + email)