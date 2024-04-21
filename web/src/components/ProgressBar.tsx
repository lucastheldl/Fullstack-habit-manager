import React from 'react'

interface Props {
  progress : number,
}

const ProgressBar = (props: Props) => {

  const progressStyles = {
    width : `${props.progress}%`,
  }
  return (
    <div className='h-3 rounded-xl bg-zinc-700 w-full mt-4'>
        <div
        role={'progressbar'}
        arial-label="Progresso de hábito completados nesse dia"
        arial-valuenow={props.progress}
        className='h-3 rounded-xl bg-violet-600 transition-all'
        style={progressStyles}
        />
    </div>
  )
}

export default ProgressBar