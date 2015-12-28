from etg import *

@app.route('/')
def mainIndex():
  with open ("about.txt", "r") as myfile:
    about=myfile.read().decode("utf-8")
    
  if (session.get('user') == None):
    print('no user')
    return render_template('index.html', context = 'loggedOut', about=about)
  else: 
    print(session.get('user'))
    return render_template('index.html', context = 'loggedIn', about=about)
    
@app.route('/getRegisterForm', methods=['POST'])
def returnRegistrationForm():
  return render_template('register.html')
  
@app.route('/getLoginForm', methods=['POST'])
def returnLoginForm():
  return render_template('login.html')
  
@app.route('/getAdminTools', methods=['POST'])
def getAdminTools():
  return render_template('adminTools.html')
  
@app.route('/getUserTools', methods=['POST'])
def getUserTools():
  return render_template('mapEditTools.html')

@app.route('/completePending/<userId>')
def completePending(userId):
  user = db_session.query(User).filter(User.id==userId).all()
  user = [i.serialize for i in user]
  db_session.remove()
  return render_template('index.html', context = 'setPassword', firstName = user[0]['first_name'], lastName = user[0]['last_name'], userId = user[0]['id'])
  
'''@app.route('/sendMail', methods=['POST'])
def sendMail():
  emailer = Email()
  userEmail = request.values.get('email')
  userFirst = request.values.get('first')
  userLast = request.values.get('last')
  token = emailer.generate_confirmation_token(userEmail)
  confirmUrl = url_for('confirmEmail', token=token, _external=True)
  confirmPage = render_template('confirmAccountEmail.html', confirmUrl=confirmUrl)
  msg = emailer.get_email(userEmail, confirmPage)
  
  try:
    mail.send(msg)
    logger.info('email sent for ' + userEmail + " has been sent")
    db_session.query(User).filter(User.email==userEmail).update({'token': token, 'pending': False}, synchronize_session='fetch')
    db_session.commit()
    db_session.remove()
  except SMTPException as error:
    logger.error('email for ' + userEmail + ' failed to send')
    logger.error(error)
  return jsonify(message = 'success')

@app.route('/confirmEmail/<token>')
def confirmEmail(token):
  emailer = Email()
  user = db_session.query(User).filter(User.token==token).all()
  user = [i.serialize for i in user]
  db_session.remove()
  try:
      email = emailer.confirm_token(token)
      return redirect(url_for('completePending', userId=user[0]['id']))
  except:
      return "that email token is invalid or has expired!"'''
  
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080) 
