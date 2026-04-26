// import { useAppDispatch } from '../../app/hooks'
import { useAddReactionMutation } from '../api/apiSlice'

import type {Post, ReactionName} from './postsSlice'
// import { reactionAdded } from './postsSlice'

const reactionEmoji: Record<ReactionName, string> = {
  thumbsUp: '👍',
  tada: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
}

type ReactionButtonsProps = {
  post: Post
}

export const ReactionButtons = ({ post }: ReactionButtonsProps) => {
  const [addReaction] = useAddReactionMutation()
  // const dispatch = useAppDispatch()

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    const reaction = name as ReactionName
    return (
      <button
        key={reaction}
        type="button"
        className="mutted-button reaction-button"
        onClick={() => {
          void addReaction({ postId: post.id, reaction }).unwrap()
        }}
      >
        {emoji} {post.reactions?.[reaction] ?? 0}
      </button>
    )
  }
)

  return <div>{reactionButtons}</div>
}