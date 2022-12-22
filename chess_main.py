#  main driver file, responsible for handling user input & displaying current GameState

import pygame as p
import chess_engine

width = 512
height = 512

# 8x8
dimension = 8 

square_size = height // dimension

# for animations (POTENTIALLY)
# max_fps = 15

# initialize a global dictionary of images, only called once at the start 
pieces = {}

def load_pieces():
    piece = ['wp', 'wR', 'wN', 'wB', 'wQ', 'wK', 'bp', 'bR', 'bN', 'bB', 'bQ', 'bK']
    
    for piece_value in piece:
        pieces[piece_value] = p.transform.scale(p.image.load('pieces/' + piece_value + '.png'), (square_size, square_size))
    
