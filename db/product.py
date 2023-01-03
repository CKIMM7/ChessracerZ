# from flask import current_app
# from flask_sqlalchemy import SQLAlchemy 
# from flask_marshmallow import Marshmallow 
# import os
# from app import app

# basedir = os.path.abspath(os.path.dirname(__file__))
# with app.app_context():
#     # Database
#     current_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
#     current_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#     # Init db
#     db = SQLAlchemy(current_app)
#     # Init ma
#     ma = Marshmallow(current_app)

# # Product Class/Model
# class Product(db.Model):
#   id = db.Column(db.Integer, primary_key=True)
#   name = db.Column(db.String(100), unique=True)
#   description = db.Column(db.String(200))
#   price = db.Column(db.Float)
#   qty = db.Column(db.Integer)

#   def __init__(self, name, description, price, qty):
#     self.name = name
#     self.description = description
#     self.price = price
#     self.qty = qty

# # Product Schema
# class ProductSchema(ma.Schema):
#   class Meta:
#     fields = ('id', 'name', 'description', 'price', 'qty')

# # Init schema
# product_schema = ProductSchema()
# products_schema = ProductSchema(many=True)

# @app.route('/products', methods=['POST'])
# def add_product():
#   name = request.json['name']
#   description = request.json['description']
#   price = request.json['price']
#   qty = request.json['qty']

#   new_product = Product(name, description, price, qty)

#   db.session.add(new_product)
#   db.session.commit()

#   return product_schema.jsonify(new_product)

# @app.route('/product', methods=['GET'])
# def get_products():
#   all_products = Product.query.all()
#   result = products_schema.dump(all_products)
#   print(result)

#   return jsonify(result)
