import logging, md5
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json, current_app)
from etg.modules import *

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
    isAdmin = request.form['reg_admin_code']
    if (isAdmin):
        logger.info('registering of admin' + userEmail + " " + userFirst + " " + userLast)
        return (userRegister(userEmail, userFirst, userLast, isAdmin))
    else:
        logger.info('registering of ' + userEmail + " " + userFirst + " " + userLast)
        return (userRegister(userEmail, userFirst, userLast))
    
    
@user_api.route('/logout')
def logout():
    session.clear()
    db_session.remove()
    db_session.close()
    return jsonify(success='success')
  
@user_api.route('/checkUser')
def checkUser():
    return jsonify(user=session.get('user'))
    
@user_api.route('/pendingUsers')
def getPendingUsers():
    logger.info('getting pending users')
    users = None
    try:
        users = db_session.query(User).filter(User.pending==1).all()
        users = [user.serialize for user in users]
        db_session.remove()
    except:
        logger.error('retrieval of pending users failed')
    return jsonify(users=users)

@user_api.route('/getAllUsers')
def getAllUsers():
    logger.info('getting all users')
    users = None
    try:
        users = db_session.query(User).all()
        users = [user.serialize for user in users]
        db_session.remove()
    except:
        logger.error('failed to get all users')
    return jsonify(users=users)
    
@user_api.route('/generatePendingUser', methods=['POST'])
def generatePendingUser():
    userId = request.values.get('id')
    firstName = request.values.get('first_name')
    lastName = request.values.get('last_name')
    email = request.values.get('email')
    return render_template('pendingUser.html', userId=userId, firstName=firstName, lastName=lastName, email=email)
    
@user_api.route('/generateProgressBar', methods=['POST'])
def generateProgressBar():
    return render_template('progressBar.html')
    
@user_api.route('/setPassword', methods=['POST'])
def setPassword():
    userPass = request.form['password']
    userId = request.form['userId']
    password = md5.new(userPass).hexdigest()
    try:
        db_session.query(User).filter(User.id==userId).update({'password': password}, synchronize_session='fetch')
        db_session.commit()
        db_session.remove()
        logger.info('user updated successfully')
    except:
        logger.error('the user could not be updated')
    return url_for('mainIndex', _external=True)

@user_api.route('/forgotPassword')
def forgotPassword():
    return render_template('forgotPassword.html', external=True)
    
@user_api.route('/setAdminCode', methods=['POST'])
def setAdminCode():
    adminCode = request.form['code']
    code = md5.new(adminCode).hexdigest()
    try:
        result = db_session.query(AdminCode).first()
        if (result):
            db_session.query(AdminCode).filter(AdminCode.id==result.id).update({'code': code}, synchronize_session='fetch')
        else:
            newCode = AdminCode(code=code)
            db_session.add(newCode)
        db_session.commit()
        db_session.remove()
        logger.info('admin code updated sucessfully')
        return jsonify(message='success')
    except:
        logger.error('admin code could not be updated')
        return jsonify(error='error')
    
@user_api.route('/denyUser', methods=['POST'])
def denyUser():
    userEmail = request.values.get('email')
    userId = request.values.get('userId')
    try:
        user = db_session.query(User).filter(User.id==userId).first()
        db_session.delete(user)
        db_session.commit()
        db_session.remove()
        logger.info('user ' + userEmail + ' has been removed')
    except:
        logger.error('error removing user')
    return jsonify(message='success')
    
@user_api.route('/completePending/<userId>')
def completePending(userId):
    user = db_session.query(User).filter(User.id==userId).all()
    user = [i.serialize for i in user]
    db_session.remove()
    return render_template('index.html', context='setPassword', firstName=user[0]['first_name'], lastName=user[0]['last_name'], userId=user[0]['id'])
    
@user_api.route('/resetPassword/<userId>')
def resetPassword(userId):
    user = db_session.query(User).filter(User.id==userId).all()
    user = [i.serialize for i in user]
    db_session.remove()
    return render_template('index.html', context='resetPassword', firstName=user[0]['first_name'], lastName=user[0]['last_name'], userId=user[0]['id'])

def userLogin(email, password):
    dk = md5.new(password).hexdigest()
    logger.info('checking DB for user')
    user = None
    try:
        user = db_session.query(User).filter(and_(User.email==email, User.password==dk, User.pending!=1)).all()
        user = [i.serialize for i in user]
        db_session.remove()
        
        if (len(user) != 0):
            logger.info('user found')
            session['user'] = user[0]
        else:
            logger.info('user not found')
    except:
        logger.error('user login check failed')
        
    return jsonify(user=user)
 
def userRegister(email, first, last, isAdmin="user"):
    dk = md5.new(isAdmin).hexdigest()
    checkUser = db_session.query(User).filter(User.email==email).first()
    accountType = 2
    adminPass = None
    
    if (not checkUser):
        
        if (isAdmin != "user"):
            adminPass = db_session.query(AdminCode).filter(AdminCode.code==dk).all()
            adminPass = [i.serialize for i in adminPass]
            db_session.remove()
        
            if (len(adminPass) == 0):
                logger.error('incorrect admin code')
                return jsonify(error='errorCode')
            else:
                accountType = 1
        
        newUser = User(email=email, first_name=first, last_name=last, pending=True, account_type_id_fk=accountType)
        
        try:
            db_session.add(newUser)
            db_session.commit()
            db_session.remove()
            logger.info('added user ' + email)
        except:
            logger.error('new user insert failed for ' + email)
    
        return jsonify(emailParams={'email': email, 'first': first, 'last': last})
    else:
        logger.error('user already exists')
        return jsonify(error='duplicate')
