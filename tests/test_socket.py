import pytest
from app import socketio, create_lobby, join_room

# manager = SocketIOManager()

# socketio = SocketIO()

# request = type('Request', (object,), {'sid': 'dummy-sid'})

# socketio.server = type('Server', (object,), {'manager': manager})

def test_create_lobby():
    create_lobby("TestLobby")

    assert "TestLobby" in socketio.server.manager.rooms['/']
    assert socketio.emit.call_args_list[-1][0][0] == 'console-message'
    assert socketio.emit.call_args_list[-1][0][1] == f"{request.sid} created {lobby_id} succesfully"
    assert socketio.emit.call_args_list[-2][0][0] == 'send-to-game'
    assert socketio.emit.call_args_list[-2][0][1] == 'w'
    assert socketio.emit.call_args_list[-2][1]['room'] == request.sid

    create_lobby("TestLobby")
    assert socketio.emit.call_args_list[-1][0][0] == 'console-message'
    assert socketio.emit.call_args_list[-1][0][1] == "Lobby name already taken"