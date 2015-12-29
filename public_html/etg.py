from etg import *

@app.route('/')
def mainIndex():
  with open ("about.txt", "r") as myfile:
    about=myfile.read().decode("utf-8")
    
  if (session.get('user') == None):
    print('no user')
    return render_template('index.html', context='loggedOut', about=about)
  else: 
    print(session.get('user'))
    return render_template('index.html', context='loggedIn', about=about)
    
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
  
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080) 
