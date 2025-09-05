import { Student } from "../models/students.models.js";
import { Career } from "../models/careers.models.js";

export const createStudent = async (req,res) =>{
    try{

    const { identification,name,lastname,email,phone,career} = req.body

    // validamos si existe el email
    const existEmail = await Student.findOne({where:{email:email}})
    if(existEmail) return res.status(400).json({message:"Email already exists for Students"})

    // verificamos si existe la identificación
    const existIdenfitication = await Student.findOne({where:{identification:identification}})
    if(existIdenfitication) return res.status(400).json({message:"Identification already exists for Students"})
    
    if(phone){
    // verificamos si existe el phone
    const existPhone = await Student.findOne({where:{phone:phone}})  
    if(existPhone) return res.status(400).json({message:"Phone already exists for Students"})
    }
    //si carrera tiene algo
    // verificamos si existe la carrera
    if(career){
    const existCareer= await Career.findOne({where:{id:career}})
    if(!existCareer) return res.status(404).json({message:"Career not exists"})
    }
    
    
    const newStudent = await Student.create({
        identification,
        name,
        lastname,
        email,
        phone,
        career_id:career || null
    })

    res.status(201).json({message:"Student created successfully",id:newStudent.id, name:newStudent.name})

    }catch(error){
         return console.log(error),res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const getStudentById = async (req,res) =>{
    
}

export const getStudentByCareer = async (req,res) =>{

}

export const getStudentByEmail = async (req,res) =>{

}

export const getStudents = async (req,res) =>{

}

export const updateStudent = async (req,res) =>{

}

export const deleteStudent = async (req,res) =>{

}
