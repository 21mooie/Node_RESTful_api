/*
    Library for storing and editing data
*/

const fs = require('fs');
const path = require('path');

var lib = {};

lib.baseDir = path.join(__dirname,'/../.data/');

//write data to directory/subdirectory
lib.create = function(dir,file,data,callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor,stringData,function(err){
                if (!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false); 
                        }
                        else{
                            callback('Error closing file')
                        }
                    })
                }
                else{
                    callback('Error writing to new file');
                }
            })

        }
        // file already exists so there will be error
        else{
            callback('Could not create new file, may already exist');
        }
    });
}

lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
        callback(err,data)
    })
}

lib.update = function(dir,file,data,callback){
    //open file
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
        if (!err && fileDescriptor){
            var stringData = JSON.stringify(data);
            fs.truncate(fileDescriptor,function(err){
                if (err){
                    callback(err)
                }
                //write to file & close
                fs.writeFile(fileDescriptor,stringData,function(err){
                    if (!err){
                        fs.close(fileDescriptor,function(err){
                            if (err){
                                callback('Error closing existing file')
                            }
                        })
                    }
                    else{
                        callback('Error writing to file')
                    }
                })
            })
        }
        else{
            callback('Could not open file for updating May not exist')
        }
    })
}

lib.delete = function(dir,file,callback){
    //unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if (err)
            callback('Error deleting file');
    })
}




module.exports = lib;