import pytest
from unittest.mock import MagicMock
from app import app, socketio

socketio.emit = MagicMock()

flask_test_client = app.test_client()

socketio_test_client = socketio.test_client(app, flask_test_client=flask_test_client)

def test_can_connect():
    assert socketio_test_client.is_connected()


def test_create_lobby():

    socketio_test_client.emit("create-lobby", "TestLobby")

    assert "TestLobby" in socketio.server.manager.rooms['/']
    assert socketio.emit.call_args_list[0][0][0] == 'console-message'
    assert "created TestLobby succesfully" in socketio.emit.call_args_list[0][0][1]
    assert socketio.emit.call_args_list[-1][0][0] == 'send-to-game'
    assert socketio.emit.call_args_list[-1][0][1] == 'w'

    socketio_test_client.emit("create-lobby", "TestLobby")
    assert socketio.emit.call_args_list[-1][0][0] == 'console-message'
    assert socketio.emit.call_args_list[-1][0][1] == "Lobby name already taken"

