from etg.modules.database.database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils.types.password import PasswordType

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String(40), nullable=False, unique=True)
    password = Column(String(300))
    first_name = Column(String(20))
    last_name = Column(String(20))
    pending = Column(Integer)
    token = Column(String(300))
    account_type_id_fk = Column(Integer, nullable=False)
    
    def __init__(self, email=None, password=None, first_name=None, last_name=None, pending=None, token=None, account_type_id_fk=None):
        self.email = email
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.pending = pending
        self.token = token
        self.account_type_id_fk = account_type_id_fk
        
    def __repr__(self):
      returnList = "['id': '%s', 'email': '%s', 'password': '%s', 'first_name': '%s', 'last_name': '%s', 'pending': '%s', 'token': '%s', 'account_type_id_fk': '%s']" % (
          self.id, self.email, self.password, self.first_name, self.last_name, self.pending, self.token, self.account_type_id_fk)
      return returnList
        
    @property
    def serialize(self):
     return {
       'id': self.id,
       'email': self.email,
       'first_name': self.first_name,
       'last_name': self.last_name,
       'pending': self.pending,
       'token': self.token,
       'account_type_id_fk': self.account_type_id_fk,
      }