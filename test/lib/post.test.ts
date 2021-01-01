import { getAllPostIds } from '../../lib/posts';

it('getAllPostIds should return ids', () => {
  const ids = getAllPostIds();
  expect(ids).toHaveLength(2);
  expect(ids[0].params.id).toBe('pre-rendering');
  expect(ids[1].params.id).toBe('ssg-ssr');
});
