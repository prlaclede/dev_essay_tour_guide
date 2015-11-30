from etg.modules.database.database import Base
from sqlalchemy import Column, Integer, String, Text

class Instruction(Base):
    __tablename__ = 'instructions'
    id = Column(Integer, primary_key=True)
    name = Column(String(20), nullable=False)
    drive_id = Column(Integer, nullable=False)
    
    def __init__(self, name=None, drive_id=None):
        self.name = name
        self.drive_id = drive_id
        
    def __repr__(self):
      returnList = "['id': '%s', 'name': '%s', 'drive_id': '%s']" % (
          self.id, self.name, self.drive_id)
      return returnList
      
    @property
    def serialize(self):
     return {
       'id': self.id,
       'name': self.name,
       'drive_id': self.drive_id
      }