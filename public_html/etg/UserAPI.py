import logging, md5
from flask import Blueprint, Flask, session, render_template, request, redirect, url_for, jsonify, json
from modules import *

user_api = Blueprint('user_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def connectToEssayDB():
  try:
    return engine.connect()
  except:
    print("Can't connect to database alien")

@user_api.route('/login', methods=['POST'])
def login():
    userEmail = request.form['userLoginEmail']
    userPass = request.form['userLoginPass']
    logger.info(userEmail + " " + userPass)
    return (userLogin(userEmail, userPass))
  
@user_api.route('/checkUser')
def checkUser():
    return jsonify(user=session.get('user'))
  
def userLogin(email, password):
    dk = md5.new(password).hexdigest()
    logger.info('checking DB for user')
    conn = connectToEssayDB()
    user = User.query.filter(and_(User.email==email, User.password==dk)).all()
    user = [i.serialize for i in user]
    
    if (len(user) != 0):
        logger.info('user found')
        session['user'] = (user[0])
        print(session.get('user'))
        return jsonify(user=user)
    else:
        logger.info('user not found')
        return jsonify(user=user)