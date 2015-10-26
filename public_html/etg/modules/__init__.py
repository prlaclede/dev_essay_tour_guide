from modules.account.account import Account
from modules.essay.essay import Essay
from modules.instruction.instruction import Instruction
from modules.marker.marker import Marker
from modules.user.user import User
from modules.database.database import Base, engine, db_session, init_db
from sqlalchemy import or_, and_