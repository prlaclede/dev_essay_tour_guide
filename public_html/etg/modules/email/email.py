from flask.ext.mail import Message, Mail
from itsdangerous import URLSafeTimedSerializer
import datetime, ConfigParser

Config = ConfigParser.ConfigParser()

class Email():
    
    Config.read('etg/protected/config.ini')
    
    def get_email(self, to, subject, template):
      mailer = Mail()
      print subject
      if (subject == 'reset'): 
        msg = Message(
          'Use the following link to reset your password with Fredericksburg Essay Tours',
          recipients=[to],
          html=template,
          sender=Config.get('flask', 'MAIL_DEFAULT_SENDER')
        )
      elif (subject == 'confirm'):
        msg = Message(
          'Please confirm your account with Fredericksburg Essay Tours!',
          recipients=[to],
          html=template,
          sender=Config.get('flask', 'MAIL_DEFAULT_SENDER')
        )
      return msg
      
    def generate_confirmation_token(self, email):
      serializer = URLSafeTimedSerializer(Config.get('flask', 'SECRET_KEY'))
      return serializer.dumps(email, salt=Config.get('flask', 'SECURITY_PASSWORD_SALT'))

    def confirm_token(self, token, expiration=3600):
      serializer = URLSafeTimedSerializer(Config.get('flask', 'SECRET_KEY'))
      try:
          email = serializer.loads(
              token,
              salt=Config.get('flask', 'SECURITY_PASSWORD_SALT'),
              max_age=expiration
          )
      except:
          return 'Invalid token supplied'
      return email