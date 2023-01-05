import pytest
from unittest.mock import MagicMock
from app import app, socketio, startTimer

socketio.emit = MagicMock()

flask_test_client = app.test_client()

def test_can_connect():
    socketio.emit.reset_mock()
    socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)

    assert socketio_test_client.is_connected()
    socketio_test_client.disconnect()

def test_create_lobby():
    socketio.emit.reset_mock()
    socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)

    socketio_test_client.emit("create-lobby", "TestLobby")

    assert "TestLobby" in socketio.server.manager.rooms['/']
    assert socketio.emit.call_args_list[0][0][0] == 'console-message'
    assert "created TestLobby succesfully" in socketio.emit.call_args_list[0][0][1]
    assert socketio.emit.call_args_list[-1][0][0] == 'send-to-game'
    assert socketio.emit.call_args_list[-1][0][1] == 'w'

    socketio_test_client.emit("create-lobby", "TestLobby")
    assert socketio.emit.call_args_list[-1][0][0] == 'console-message'
    assert socketio.emit.call_args_list[-1][0][1] == "Lobby name already taken"

    socketio_test_client.disconnect()

def test_join_lobby():
    socketio.emit.reset_mock()
    socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)

    socketio_test_client.emit("join-lobby", "TestJoin")

    assert socketio.emit.call_args_list[0][0][0] == 'console-message'
    assert "Lobby doesn't exist" in socketio.emit.call_args_list[0][0][1]

    socketio_test_client.emit("create-lobby", "TestJoin")

    assert socketio.emit.call_args_list[1][0][0] == 'console-message'
    assert "created TestJoin succesfully" in socketio.emit.call_args_list[1][0][1]

    assert socketio.emit.call_args_list[2][0][0] == 'send-to-game'
    assert socketio.emit.call_args_list[2][0][1] == 'w'

    socketio_test_client.emit("join-lobby", "TestJoin") ## line doesn't seem to trigger event

    socketio.sleep(3)
    print(socketio.emit.call_args_list)

    assert socketio.emit.call_args_list[3][0][0] == 'console-message'
    assert "joined TestJoin succesfully" in socketio.emit.call_args_list[2][0][1]

    assert socketio.emit.call_args_list[4][0][0] == 'send-to-game'
    assert socketio.emit.call_args_list[5][0][0] == 'console-message'
    assert "game starting..." in socketio.emit.call_args_list[4][0][1]
    assert socketio.emit.call_args_list[6][0][0] == 'start-game'

    socketio_test_client.disconnect()

def test_start_timer():
    socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)
    socketio_test_client.emit("create-lobby", "timerLobby")
    socketio.emit.reset_mock()
    
    startTimer("timerLobby")

    assert socketio.emit.call_args_list[0][0][0] == 'start-timer'
    socketio_test_client.disconnect()
    assert socketio.emit.call_args_list[0][0][1] == 8
    assert socketio.emit.call_args_list[1][0][0] == "timer-end"

# def test_pass_game():
#     socketio.emit.reset_mock()
#     socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)
#     socketio_test_client.emit("pass-game", "TestPassGame")
#     assert "TestPassGame" in socketio.server.manager.rooms['/']

#     assert socketio.emit.call_args_list[0][0][0] == 'start-timer'
