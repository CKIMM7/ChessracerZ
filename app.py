from flask import Flask, jsonify, request
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow
from flask_socketio import SocketIO, join_room, leave_room, emit, send

from werkzeug import exceptions
from subprocess import Popen
import pathlib
import hellopy
# import boto3
import asyncio

import os
# from dotenv import load_dotenv


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

basedir = os.path.abspath(os.path.dirname(__file__))
# load_dotenv(dotenv_path='.env', verbose=True)

CORS(app)

# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Init db
db = SQLAlchemy(app)

# Init db
socketio = SocketIO(app, cors_allowed_origins='*')

# Init ma
ma = Marshmallow(app)

#User Class/Model
class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  access_token = db.Column(db.String(100))
  name = db.Column(db.String(100))
  email = db.Column(db.String(100), unique=True)
  guid = db.Column(db.String(100))
  photo = db.Column(db.String(100))
  access_id = db.Column(db.String(100))
  secret_id = db.Column(db.String(100))
  instance_id = db.Column(db.String(100))

  def __init__(self, access_token, name, email, guid, photo, access_id, secret_id, instance_id):
    self.access_token = access_token
    self.name = name
    self.email = email
    self.guid = guid
    self.photo = photo
    self.access_id = access_id
    self.secret_id = secret_id
    self.instance_id = instance_id

# User Schema
class UserSchema(ma.Schema):
  class Meta:
    fields = ('id', 'access_token', 'name', 'email', 'guid', 'photo', 'access_id', 'secret_id', 'instance_id')

# Init schema
user_schema = UserSchema()
users_schema = UserSchema(many=True)

@socketio.on("connect")
def on_connect(): 
  print("Client connected")

@socketio.on("disconnect")
def on_disconnect():
  print("Client disconnected")

@socketio.on('create-lobby')
def create_lobby(lobbyId):
    try:
        socketio.server.manager.rooms['/'][lobbyId]
        socketio.emit("console-message", "Lobby name already taken")
    except:
        join_room(lobbyId)
        socketio.emit("console-message", f"{request.sid} created {lobbyId} succesfully", room=lobbyId)
        socketio.emit("send-to-game", room=request.sid)
       


@socketio.on('join-lobby')
def join_lobby(lobbyId):

    rooms = socketio.server.manager.rooms   # gets all rooms
    lobby = rooms['/'][lobbyId]             # gets current lobby from room

    if (not lobby):
        socketio.emit("console-message", "Lobby doesn't exist")
    elif (len(lobby) >= 2):
        socketio.emit("console-message", "Lobby is already full")
    else:
        join_room(lobbyId)
        socketio.emit("console-message", f"{request.sid} joined {lobbyId} succesfully", room=lobbyId)
        socketio.emit("send-to-game", room=request.sid)


# Game timer
@socketio.on('start-game')
def startGame(lobbyId):
  print("starting timer")
  asyncio.run(startTimer(lobbyId))


async def startTimer(lobbyId):
  await asyncio.sleep(90)
  print("timer finished")
  socketio.emit("timer-end", room=lobbyId)

@socketio.on('pass-game')
def updateGame(lobbyId, source, target):
  print('updatedGame')

  moves = {
          'src': source,
          'tar': target
          }
  print(moves)

  socketio.emit("get-moves", moves, room=lobbyId)


@app.route('/user', methods=['POST'])
def add_User():

    access_token = request.json['data']['accessToken']
    name = request.json['data']['displayName']
    email = request.json['data']['email']
    guid = request.json['data']['guid']
    photo = request.json['data']['photo']

    print(request.json['data'])

    existing_user = User.query.filter_by(guid=guid).first()
    if existing_user:

        print('user alread exists')
        print(existing_user)

        return user_schema.jsonify(existing_user)
    else:
        new_user = User(access_token, name, email, guid, photo, '', '', '')
        print('new user')
        print(new_user)

        db.session.add(new_user)
        db.session.commit()
        user_schema.jsonify(new_user)

        return user_schema.jsonify(new_user)


@app.route('/users', methods=['GET'])
def get_user():
  all_users = User.query.all()
  result = users_schema.dump(all_users)
  print('get all users')
  print(result)

  return jsonify(result)


@app.route('/', methods=['GET'])
def home():

    print('request.method')
    print(request.method)
    pathlib.Path(__file__).parent.resolve()
    return jsonify({'message': 'Hello from Flask!'}), 200

if __name__ == "__main__":
    socketio.run(app)
