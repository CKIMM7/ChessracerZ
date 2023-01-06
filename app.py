from flask import Flask, jsonify, request
from flask_cors import CORS

from flask_socketio import SocketIO, join_room, leave_room, emit, send

import os


app = Flask(__name__)

# Init socket
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins='*')

basedir = os.path.abspath(os.path.dirname(__file__))
# load_dotenv(dotenv_path='.env', verbose=True)

CORS(app)

@socketio.on("connect")
def on_connect():
  rooms = socketio.server.manager.rooms
  print(rooms)
  print("Client connected")


@socketio.on("disconnect")
def on_disconnect():
  print("Client disconnected")

@socketio.on('create-lobby')
def create_lobby(lobbyId):
    try:
        socketio.server.manager.rooms['/'][lobbyId]
        socketio.emit("display-message", "Lobby name already taken")
    except:
        join_room(lobbyId)
        socketio.emit("console-message", f"{request.sid} created {lobbyId} succesfully", room=lobbyId)
        socketio.emit("send-to-game", 'w', room=request.sid)
       


@socketio.on('join-lobby')
def join_lobby(lobbyId):

  lobby = ""
  print(lobbyId)
  try:
    rooms = socketio.server.manager.rooms   # gets all rooms
    lobby = rooms['/'][lobbyId]             # gets current lobby from room
    print(lobby)
    if (len(lobby) >= 2):
      socketio.emit("display-message", "Lobby is already full")
    else:
      join_room(lobbyId)
      socketio.emit("console-message", f"{request.sid} joined {lobbyId} succesfully", room=lobbyId)
      socketio.emit("send-to-game", room=request.sid)
      socketio.sleep(1)
      socketio.emit("console-message", f"game starting...", room=lobbyId)
      socketio.emit("start-game", room=lobbyId)
      startTimer(lobbyId)
  except:
      socketio.emit("display-message", "Lobby doesn't exist")

def startTimer(lobbyId):
  socketio.sleep(3)
  print(f"Lobby {lobbyId}: Starting timer")
  time = 30
  socketio.emit("start-timer", time ,room=lobbyId)
  socketio.sleep(time)
  print(f"Lobby {lobbyId}: Timer finished")
  socketio.emit("timer-end", room=lobbyId)
  try:
    lobby = socketio.server.manager.rooms['/'][lobbyId]
    startTimer(lobbyId)
  except:
    print(f"Lobby {lobbyId}: Timer finished lobby closed")

@socketio.on('pass-game')
def updateGame(lobbyId, source, target):
  print(f"Lobby {lobbyId}: updatedGame")

  moves = {
          'src': source,
          'tar': target
          }

  print(f"Lobby {lobbyId}: {moves}")
  socketio.emit("get-moves", moves, room=lobbyId)

@socketio.on('pass-game-race')
def updateGameRace(lobbyId, x, y, player_lap, opponent_lap):
  print('updatedGame-Race')
  print(f"----------{player_lap}----------------")

  moves = {
          'x': x,
          'y': y
          }

  print(moves)
  if(player_lap):
      moves['player_lap'] = player_lap
      socketio.emit("get-moves-race", moves, room=lobbyId, include_self=False)

  socketio.emit("get-moves-race", moves, room=lobbyId, include_self=False)


@socketio.on('end-game')
def endGame(lobbyId):
  print('Game has ended')
  leave_room(lobbyId)
  socketio.sleep(7)
  socketio.emit("send-to-home", room=request.sid)
  rooms = socketio.server.manager.rooms   # gets all rooms
  lobby = rooms['/'][lobbyId]             # gets current lobby from room
  print(lobby)
  socketio.emit('end-game', room=lobbyId)


if __name__ == "__main__":
    socketio.run(app)
