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
    account_type_id_fk = Column(Integer, nullable=False)
    instr_id_fk = Column(Integer, nullable=False)
    
    def __init__(self, email=None, password=None, first_name=None, last_name=None, pending=None, account_type_id_fk=None, instr_id_fk=None):
        self.email = email
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.pending = pending
        self.account_type_id_fk = account_type_id_fk
        self.instr_id_fk = instr_id_fk
        
    def __repr__(self):
      returnList = "['id': '%s', 'email': '%s', 'password': '%s', 'first_name': '%s', 'last_name': '%s', 'pending': '%s', 'account_type_id_fk': '%s', 'instr_id_fk': '%s']" % (
          self.id, self.email, self.password, self.first_name, self.last_name, self.pending, self.account_type_id_fk, self.instr_id_fk)
      return returnList
        
    @property
    def serialize(self):
     return {
       'id': self.id,
       'email': self.email,
       'first_name': self.first_name,
       'last_name': self.last_name,
       'pending': self.pending,
       'account_type_id_fk': self.account_type_id_fk,
       'instr_id_fk': self.instr_id_fk
      }