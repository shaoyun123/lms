// #region   常量
export const ORDER_TYPE_STATUS = [
  {
    label: '录入时间倒序',
    value: 'temuItem.create_time DESC'
  },
  {
    label: '录入时间正序',
    value: 'temuItem.create_time ASC'
  },
  {
    label: '今日销量倒序',
    value: 'sum(sales.today_sale_volume) DESC'
  },
  {
    label: '今日销量正序',
    value: 'sum(sales.today_sale_volume) ASC'
  },
  {
    label: '7日销量倒序',
    value: 'sum(sales.last_seven_days_sale_volume) DESC'
  },
  {
    label: '7日销量正序',
    value: 'sum(sales.last_seven_days_sale_volume) ASC'
  },
  {
    label: '30日销量倒序',
    value: 'sum(sales.last_thirty_days_sale_volume) DESC'
  },
  {
    label: '30日销量正序',
    value: 'sum(sales.last_thirty_days_sale_volume) ASC'
  },
  {
    label: '评分正序',
    value: 'sales.mark is null, sales.mark asc'
  },
  {
    label: '评分倒序',
    value: 'sales.mark desc'
  },
  {
    label: '评论数正序',
    value: 'sales.comment_num is null, sales.comment_num asc'
  },
  {
    label: '评论数倒序',
    value: 'sales.comment_num desc'
  },
  {
    label: '加入站点时间正序',
    value:
      'sales.on_sales_duration_offline is null, sales.on_sales_duration_offline asc'
  },
  {
    label: '加入站点时间倒序',
    value: 'sales.on_sales_duration_offline desc'
  },
  {
    label: '品质分正序',
    value: 'sales.afs_score is null, sales.afs_score asc'
  },
  {
    label: '品质分倒序',
    value: 'sales.afs_score DESC'
  }
];
