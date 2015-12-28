import os, logging, md5
from flask import (Blueprint, Flask, session, render_template, request, 
redirect, url_for, jsonify, json, current_app)
from flask.ext.mail import Mail
from smtplib import SMTPException
from etg.modules import *

mail_api = Blueprint('mail_api', __name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@mail_api.route('/sendMail', methods=['POST'])
def sendMail():
  app = current_app._get_current_object()
  mail = Mail(app)
  print('mail instance')
  emailer = Email()
  userEmail = request.values.get('email')
  userFirst = request.values.get('first')
  userLast = request.values.get('last')
  token = emailer.generate_confirmation_token(userEmail)
  confirmUrl = url_for('.confirmEmail', token=token, _external=True)
  confirmPage = render_template('confirmAccountEmail.html', confirmUrl=confirmUrl)
  msg = emailer.get_email(userEmail, confirmPage)
  
  try:
    mail.send(msg)
    #return redirect(url_for('/sendMail', msg=msg, email=userEmail), _external=True, _scheme='https'))
    logger.info('email sent for ' + userEmail + " has been sent")
    db_session.query(User).filter(User.email==userEmail).update({'token': token, 'pending': False}, synchronize_session='fetch')
    db_session.commit()
    db_session.remove()
  except SMTPException as error:
    logger.error('email for ' + userEmail + ' failed to send')
    logger.error(error)
  return jsonify(message = 'success')

@mail_api.route('/confirmEmail/<token>')
def confirmEmail(token):
  emailer = Email()
  user = db_session.query(User).filter(User.token==token).all()
  user = [i.serialize for i in user]
  db_session.remove()
  try:
      email = emailer.confirm_token(token)
      return redirect(url_for('completePending', userId=user[0]['id']))
  except:
      return "that email token is invalid or has expired!"