from etg.modules.database.database import Base
from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import sessionmaker

class AdminCode(Base):
    __tablename__ = 'admin_code'
    id = Column(Integer, primary_key=True)
    code = Column(String(300))
    
    def __init__(self, code=None):
        self.code = code
        
    def __repr__(self):
      returnList = "['id': '%s', 'code': '%s'" % (
        self.id, self.code)
      return returnList
      
    @property
    def serialize(self):
     return {
       'id': self.id,
       'code': self.code,
      }
    