from modules.database.database import Base
from sqlalchemy import Column, Integer, String, Text

class Instruction(Base):
    __tablename__ = 'instructions'
    id = Column(Integer, primary_key=True)
    name = Column(String(20), nullable=False)
    location = Column(Text, nullable=False)
    
    def __init__(self, name=None, location=None):
        self.name = name
        self.location = location
        
    def __repr__(self):
      returnList = "['id': '%s', 'name': '%s', 'location': '%s']" % (
          self.id, self.name, self.location)
      #return '<Instruction %r>' % (self.name)
      return returnList
      
    @property
    def serialize(self):
     return {
       'id': self.id,
       'name': self.name,
       'location': self.location
      }