import { useState } from 'react'
import React, { ScrollView, View ,Text, TextInput, TouchableOpacity, Alert} from 'react-native'
import {Feather} from "@expo/vector-icons"
import colors from "tailwindcss/colors"
//components
import { BackBtn } from '../components/BackBtn'
import { CheckBox } from '../components/CheckBox'
import { api } from '../lib/axios'

type Props = {}

const avaliableWeekDays = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"]

export function New (props: Props) {

  const [weekDays,setWeekDays] = useState<number[]>([]);
  const[title, setTitle] = useState("");

  function handleToggleWeekDays(weekDaysIndex:number){
    if(weekDays.includes(weekDaysIndex)){
      setWeekDays(prevState =>prevState.filter(weekDay => weekDay !== weekDaysIndex));
    }else{
        setWeekDays(prevState =>[...prevState, weekDaysIndex]);
    }
  }

  async function handleCreateNewHabit(){
    try {
      if(!title || weekDays.length === 0){
        return Alert.alert("Novo Hábito","Digite um título válido e escolha a periodicidade.")
      }
        await api.post("/habits",{
            title: title,
            weekDays: weekDays,
        });
        setTitle("");
        setWeekDays([]);
        Alert.alert("Novo Hábito","Hábito criado com sucesso!")
      
    } 
    catch (error) {
      console.log(error);
      Alert.alert("Ops","Não foi possível criar o hábito")
    }

  }

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <ScrollView
       showsVerticalScrollIndicator ={false}
       contentContainerStyle={{paddingBottom:100}}
       >
        <BackBtn/>
        <Text className='mt-6 text-white font-extrabold text-3xl'>
          Criar hábito
        </Text>
        <Text className='mt-6 text-white font-semibold text-base'>
          Qual seu comprometimento?
        </Text>

        <TextInput
        className='h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600'
        placeholder='Exercícios, dormir bem, etc...'
        placeholderTextColor={colors.zinc[400]}
        onChangeText={setTitle}
        value={title}
        >
        </TextInput>

        <Text className='font-semibold mt-4 mb-3 text-white text-base'>
          Qual a recorrencia?
        </Text>
        
        {avaliableWeekDays.map((day, i) =>{
          return(
          <CheckBox 
           title={day}
           key={`${day}+${i.toString()}`}
           checked={weekDays.includes(i)}
           onPress={()=>handleToggleWeekDays(i)}
           />)
        })}

        <TouchableOpacity
        className='w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6'
        activeOpacity={0.7}>
          <Feather 
          name='check'
          size={20}
          color={colors.white}/>
          <Text 
          className='text-white font-semibold text-based ml-2'
          onPress={handleCreateNewHabit}
          >
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
