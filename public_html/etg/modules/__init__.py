from etg.modules.account.account import Account
from etg.modules.essay.essay import Essay
from etg.modules.instruction.instruction import Instruction
from etg.modules.marker.marker import Marker
from etg.modules.user.user import User
from etg.modules.drive.drive import Drive
from etg.modules.database.database import Base, engine, db_session, init_db
from etg.modules.email.email import Email
from sqlalchemy import or_, and_, func