import logging, md5
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json)
from itsdangerous import URLSafeTimedSerializer
from modules import *

init_db()

user_api = Blueprint('user_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@user_api.route('/login', methods=['POST'])
def login():
    userEmail = request.form['log_email']
    userPass = request.form['log_pass']
    logger.info('login of ' + userEmail)
    return (userLogin(userEmail, userPass))
    
@user_api.route('/register', methods=['POST'])
def register():
    userEmail = request.form['reg_email']
    userFirst = request.form['reg_first']
    userLast = request.form['reg_last']
    print(userEmail)
    logger.info('register of ' + userEmail + " " + userFirst + " " + userLast)
    return (userRegister(userEmail, userFirst, userLast))
    
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
    try:
        users = User.query.filter(User.pending==1).all()
        users = [user.serialize for user in users]
    except:
        logger.error('retrieval of pending users failed')
        
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
    
    try:
        user = User.query.filter(and_(User.email==email, User.password==dk, User.pending!=1)).all()
        user = [i.serialize for i in user]
        
        if (len(user) != 0):
            logger.info('user found')
            session['user'] = (user[0])
        else:
            logger.info('user not found')
    except:
        logger.error('user login check failed')
        
    return jsonify(user=user)
        
def userRegister(email, first, last):
    user = User(email=email, first_name=first, last_name=last, pending=True, account_type_id_fk=2, instr_id_fk=2)
    
    try:
        db_session.add(user)
        db_session.commit()
        logger.info('added user' + email)
    except:
        logger.error('new user insert failed for ' + email)
    
    return jsonify(message='success')