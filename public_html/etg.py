from etg import *

@app.route('/')
def mainIndex():
  if (session.get('user') == None):
    print('no user')
    return render_template('index.html', loggedIn = False)
  else: 
    print(session.get('user'))
    return render_template('index.html', loggedIn = True)
  
@app.route('/getRegisterForm', methods=['POST'])
def returnRegistrationForm():
  return render_template('register.html')
  
@app.route('/getLoginForm', methods=['POST'])
def returnLoginForm():
  return render_template('login.html')
  
@app.route('/sendMail', methods=['POST'])
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
  except SMTPException as error:
    logger.error('email for ' + userEmail + ' failed to send')
    logger.error(error)
  return jsonify(message = 'success')

@app.route('/confirmEmail/<token>')
def confirmEmail(token):
  emailer = Email()
  print(token)
  try:
      email = emailer.confirm_token(token)
      redirect(url_for('index.html'))
  except:
      return "that email token is invalid or has expired!"
  
  print('user confirmed email, do database things now ....')
  
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080) 
