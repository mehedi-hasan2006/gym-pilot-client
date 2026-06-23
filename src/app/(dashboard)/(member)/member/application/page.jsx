import React from 'react'
import ApplyTrainer from '../../_components/ApplyTrainer'
import { sessionData } from '@/lib/session/session'

export default async function TrainerApplyPage() {

    const user = await sessionData()

  return (
    <div>
        <ApplyTrainer user={user}/>
    </div>
  )
}
