from flask import Flask, jsonify, request
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow
from flask_socketio import SocketIO, emit 

from werkzeug import exceptions
from subprocess import Popen
import pathlib
import hellopy
import boto3

import os
from dotenv import load_dotenv


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(dotenv_path='.env', verbose=True)

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

admin_aws_access_key_id=os.getenv('admin_aws_access_key_id')
admin_aws_secret_access_key=os.getenv('admin_aws_secret_access_key')

@app.route('/iam/new', methods=['POST'])
def iam_new_user():

    #get guid and start session

    print(request.json)

    existing_user = User.query.filter_by(guid=request.json['guid']).first()
    print('user to filter out for IAM Account Creation')
    print(existing_user)


    #'admin:AKIAUCXTXAAI4YYSLVRR'
    #'280757731345'
    print('admin:AKIAUCXTXAAI4YYSLVRR')
    print(request.json['name'].replace(" ", "_").lower())
    result = hellopy.hello_world()

    iam = boto3.client('iam',
         aws_access_key_id=admin_aws_access_key_id,
         aws_secret_access_key=admin_aws_secret_access_key,
         region_name='eu-west-2')

    #create user  
    response = iam.create_user(
    UserName= request.json['name'].replace(" ", "_").lower()
    )
    ##save to IAM_user data to database
    print(response['User'])
    

    #save access key  
    response1 = iam.create_access_key(
        UserName=response['User']['UserName']
    )



    ##save to IAM_user access/secret to database
    print('after key creation')
    print(response1)

    AccessKeyId = response1['AccessKey']['AccessKeyId']
    SecretAccessKey = response1['AccessKey']['SecretAccessKey']
    print('AccessKeyId''AccessKeyId''AccessKeyId')
    print(AccessKeyId)
    print(SecretAccessKey)

    #add user to group
    if response['User']['UserId']:
        print(response['User']['UserId'])

        response = iam.add_user_to_group(
            GroupName='student',
            UserName=response['User']['UserName']
        )
        print('after group creation')
        print(response)

    existing_user.access_id = AccessKeyId
    existing_user.secret_id = SecretAccessKey
    db.session.commit()

    return jsonify({'message': result}), 200




@app.route('/bucket', methods=['POST'])
def bucket():

    print('request.method')
    print(request.method)
    path =  pathlib.Path(__file__).parent.resolve()
    print(path)
    result = hellopy.hello_world()

    s3 = boto3.resource('s3',
         aws_access_key_id='AKIAUCXTXAAIXQCVARSC',
         aws_secret_access_key='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',
         region_name='eu-west-2'
         )

    print(s3)

    for bucket in s3.buckets.all():
        print(bucket.name)

    return jsonify({'message': result}), 200

@app.route('/ec2/create', methods=['POST'])
def ec():

    result = hellopy.hello_world()

    existing_user = User.query.filter_by(guid=request.json['guid']).first()
    print('user to filter out for EC2 Views')
    print(existing_user)

    ec2 = boto3.resource('ec2',
         aws_access_key_id=existing_user.access_id,
         aws_secret_access_key=existing_user.secret_id,
         region_name='eu-west-2')

    print(ec2)

    instance = ec2.create_instances(
            ImageId="ami-084e8c05825742534",
            MinCount=1,
            MaxCount=1,
            InstanceType="t2.micro",
            KeyName="KeyPair1",
            SecurityGroupIds=[
            'sg-0f6e6789ff4e7e7c1',
            ],
        )

    print('successfully lauched an instance save it to User db')
    print(instance[0].id)
    existing_user.instance_id = instance[0].id
    db.session.commit()
    print(type(instance[0]))

    return jsonify({'message': result}), 200

@app.route('/ec2/instances', methods=['POST'])
def ec_view_instances():
    print('what?')

    existing_user = User.query.filter_by(guid=request.json['guid']).first()
    print('user to filter out for EC2 Views')
    print(existing_user)

    ec2 = boto3.resource('ec2',
         aws_access_key_id=existing_user.access_id,
         aws_secret_access_key=existing_user.secret_id,
         region_name='eu-west-2')
    
    for instance in ec2.instances.all():
        #save this instance to User
        print(instance)

    result = hellopy.hello_world()


    return jsonify({'message': result}), 200


@app.route('/ec2/stop', methods=['POST'])
def ec_stop_instances():

    existing_user = User.query.filter_by(guid=request.json['guid']).first()
    print('user to filter out to stop ec2')
    print(existing_user)

    result = hellopy.hello_world()
    ec2 = boto3.client('ec2',

         aws_access_key_id=existing_user.access_id,
         aws_secret_access_key=existing_user.secret_id,

         region_name='eu-west-2')
    
    response = ec2.stop_instances(
        InstanceIds=[
            existing_user.instance_id,
        ],
        Hibernate=False,
        DryRun=False,
        Force=False
    )

    print(response)

    return jsonify({'message': result}), 200

@app.route('/ec2/start', methods=['POST'])
def ec_start_instances():

    existing_user = User.query.filter_by(guid=request.json['guid']).first()
    print('user to filter out to stop ec2')
    print(existing_user)

    result = hellopy.hello_world()
    ec2 = boto3.client('ec2',
         aws_access_key_id=existing_user.access_id,
         aws_secret_access_key=existing_user.secret_id,
         region_name='eu-west-2')
    
    response = ec2.start_instances(
        InstanceIds=[
            existing_user.instance_id,
        ],
        AdditionalInfo='string',
        DryRun=False
    )

    print(response)
    
    return jsonify({'message': result}), 200


@app.route('/ec2/instance/terminate', methods=['POST'])
def ec_terminate_instances():

    result = hellopy.hello_world()
    ec2 = boto3.client('ec2',
         aws_access_key_id='AKIAUCXTXAAIXQCVARSC',
         aws_secret_access_key='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',
         region_name='eu-west-2')
         
    response = ec2.terminate_instances(
            InstanceIds=[
            'i-0b26f473cc31c5104',
        ],
    )
    print(response)
    return jsonify({'message': result}), 200



if __name__ == "__main__":
    socketio.run(app)
