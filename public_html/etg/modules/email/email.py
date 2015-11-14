from flask.ext.mail import Message, Mail
from itsdangerous import URLSafeTimedSerializer
import datetime

class Email():
    
    configProperties = {
      'SECRET_KEY': 'wow_so_secret',
      'SECURITY_PASSWORD_SALT': 'much_protect',
      'MAIL_SERVER': 'smtp.googlemail.com',
      'MAIL_PORT': 465,
      'MAIL_USE_SSL': True,
      'MAIL_USE_TLS': False,
      'MAIL_USERNAME': 'fredessaytours@gmail.com',
      'MAIL_PASSWORD': 'fredessaytour'
    }
    
    SECRET_KEY = 'wow_so_secret',
    SECURITY_PASSWORD_SALT = 'much_protect',
    MAIL_SERVER = 'smtp.googlemail.com',
    MAIL_PORT = 465,
    MAIL_USE_SSL = True,
    MAIL_USE_TLS = False,
    MAIL_USERNAME = 'fredessaytours@gmail.com',
    MAIL_PASSWORD = 'fredessaytour'

    # mail accounts
    MAIL_DEFAULT_SENDER = 'noreploy@tourfredericksburgva.com'
    
    def get_email(self, to, template):
      mailer = Mail()
      msg = Message(
        'Please confirm your account on ETG!',
        recipients=[to],
        html=template,
        sender=self.configProperties['MAIL_USERNAME']
      )
      return msg
      
      
    def generate_confirmation_token(self, email):
      serializer = URLSafeTimedSerializer(self.configProperties['SECRET_KEY'])
      return serializer.dumps(email, salt=self.configProperties['SECURITY_PASSWORD_SALT'])


    def confirm_token(self, token, expiration=3600):
      serializer = URLSafeTimedSerializer(self.configProperties['SECRET_KEY'])
      try:
          email = serializer.loads(
              token,
              salt=self.configProperties['SECURITY_PASSWORD_SALT'],
              max_age=expiration
          )
      except:
          return 'Invalid token supplied'
      return email