'use server'

import { Option } from '@/components/ui/multiple-selector'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/db'
import axios from 'axios'

interface SlackChannel {
  id: string
  name: string
  is_member?: boolean
}

interface SlackAPIResponse {
  ok: boolean
  channels?: SlackChannel[]
  error?: string
}

export const onSlackConnect = async (
  app_id: string,
  authed_user_id: string,
  authed_user_token: string,
  slack_access_token: string,
  bot_user_id: string,
  team_id: string,
  team_name: string,
  user_id: string
): Promise<void> => {
  if (!slack_access_token) return

  const slackConnection = await db.slack.findFirst({
    where: { slackAccessToken: slack_access_token },
    include: { connections: true },
  })

  if (!slackConnection) {
    await db.slack.create({
      data: {
        userId: parseInt(user_id),
        appId: app_id,
        authedUserId: authed_user_id,
        authedUserToken: authed_user_token,
        slackAccessToken: slack_access_token,
        botUserId: bot_user_id,
        teamId: team_id,
        teamName: team_name,
        connections: {
          create: { userId: parseInt(user_id), type: 'Slack' },
        },
      },
    })
  }
}

export const getSlackConnection = async () => {
  const { user } = await useAuth()
  if (user) {
    return await db.slack.findFirst({
      where: { userId: user.id },
    })
  }
  return null
}

export async function listBotChannels(
  slackAccessToken: string
): Promise<Option[]> {
  const url = `https://slack.com/api/conversations.list?${new URLSearchParams({
    types: 'public_channel,private_channel',
    limit: '200',
  })}`

  try {
    const { data } = await axios.get<SlackAPIResponse>(url, {
      headers: { Authorization: `Bearer ${slackAccessToken}` },
    })

    console.log(data)

    if (!data.ok) throw new Error(data.error)

    if (!data.channels || data.channels.length === 0) return []

    return data.channels
      .filter((ch) => ch.is_member)
      .map((ch) => ({
        label: ch.name,
        value: ch.id,
      }))
  } catch (error) {
    console.error('Error listing bot channels:', (error as Error).message)
    throw error
  }
}

export const postMessageInSlackChannel = async (
  slackAccessToken: string,
  slackChannel: string,
  content: string
): Promise<void> => {
  try {
    await axios.post(
      'https://slack.com/api/chat.postMessage',
      { channel: slackChannel, text: content },
      {
        headers: {
          Authorization: `Bearer ${slackAccessToken}`,
          'Content-Type': 'application/json;charset=utf-8',
        },
      }
    )
    console.log(`Message posted successfully to channel ID: ${slackChannel}`)
  } catch (error) {
    console.error(
      `Error posting message to Slack channel ${slackChannel}:`,
      (error as { response?: { data: { error?: string } } })?.response?.data || (error as Error).message
    )
  }
}
