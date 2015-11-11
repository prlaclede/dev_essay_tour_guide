from modules.database.database import Base
from sqlalchemy import Column, Integer, String 

class Account(Base):
    __tablename__ = 'accounts'
    id = Column(Integer, primary_key=True)
    account_name = Column(String(20), nullable=False, unique=True)
    
    def __init__(self, account_name=None):
        self.account_name = account_name
        
    def __repr__(self):
      returnList = "['id': '%s', 'account_name': '%s']" % (
          self.id, self.account_name)
      return returnList
      
    @property
    def serialize(self):
     return {
       'id': self.id,
       'account_name': self.account_name,
      }