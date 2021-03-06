import React, { useEffect } from 'react';
import { Tag, Card } from 'antd';
import { Link } from 'umi';
import { connect } from 'dva';

const Tags = props => {
  const { dispatch, tags, loading } = props;
  // useEffect(() => {
  //   if (dispatch) {
  //     dispatch({ type: 'article/tags' })
  //   }
  // }, [])

  return (
    <Card
      loading={loading}
      size="small"
      bordered={false}
      title="常用标签"
      className="mt-20"
    >
      {tags &&
        tags.map((tag: any) => (
          <Tag key={tag.en_name} className="mb-10">
            <Link
              to={{
                pathname: `/home/${tag.category.en_name}/${tag.name}`,
                state: { category: tag.category_id, tag: tag.id },
              }}
            >
              {tag.name}
            </Link>
          </Tag>
        ))}
    </Card>
  );
};

// export default connect(({ article: { tags }, loading }) => ({
//   tags,
//   loading: loading.effects['article/tags'],
// }))(Tags)

export default Tags;
