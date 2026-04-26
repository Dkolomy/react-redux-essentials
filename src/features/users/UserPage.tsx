import {Link, useParams} from 'react-router-dom'
import {createSelector} from '@reduxjs/toolkit'
import type {TypedUseQueryStateResult} from '@reduxjs/toolkit/query/react'

import {useAppSelector} from '../../app/hooks'
// import { selectPostsByUser } from '../posts/postsSlice'

import {useGetPostsQuery, type Post} from '../api/apiSlice'
import {selectUserById} from './usersSlice'

// type PostsResultArg = {
//   data?: Post[]
// }

type GetPostsSelectorResultArg = TypedUseQueryStateResult<Post[], unknown, any>

const selectPostsForUser = createSelector(
  (res: GetPostsSelectorResultArg) => res.data,
  (_res: GetPostsSelectorResultArg, userId: string) => userId,
  (data, userId) => data?.filter((post) => post.userId === userId)
)

export const UserPage = () => {
  const { userId } = useParams();

  // Always call hooks unconditionally at the top level before returning early
  const user = useAppSelector((state) => selectUserById(state, userId ?? ''));

  const { postsForUser } = useGetPostsQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      postsForUser: selectPostsForUser(result, userId!)
    }),
  });
  // const postsForUser = useAppSelector((state) => selectPostsByUser(state, userId ?? ''));

  if (!userId) {
    return (
      <section>
        <h2>User not found!</h2>
      </section>
    );
  }

  const postTitles = postsForUser?.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user?.name ?? 'Unknown user'}</h2>
      <ul>
        {postTitles}
      </ul>
    </section>
  );
};