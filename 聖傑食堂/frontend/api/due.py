from flask import Flask
from pymongo import MongoClient
import datetime
import atexit
from apscheduler.scheduler import Scheduler

app = Flask(__name__)

# DB config
client = MongoClient('mongodb+srv://SDMproject:SDMGROUP2@cluster0.w0fzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
db_name = 'SDM_project'

# delete due time 
cron = Scheduler(daemon=True)
cron.start()

@cron.interval_schedule(minutes=1)
def job_function():
    
    db = client.get_database(db_name)
    goods = db.Goods
    for document in goods.find():
        today = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=+8)))
        if today.strftime('%H:%M') == document['due']:
            goods.delete_one({'_id': document.get('_id')})

atexit.register(lambda: cron.shutdown(wait=False))

if __name__ == '__main__':
    app.run(debug=True)