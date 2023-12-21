import {
  ProjectionType,
  FilterQuery,
  SortOrder,
  PopulateOptions,
} from 'mongoose';

export interface FilterType<Model> {
  /**
   * A list of associations to eagerly load using a left join (a single association is also supported). Supported is either
   * `{ include: Model1 }`, `{ include: [ Model1, Model2, ...]}`, `{ include: [{ model: Model1, as: 'Alias' }]}` or
   * `{ include: [{ all: true }]}`.
   * If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in
   * the as attribute when eager loading Y).
   */
  include?: ProjectionType<Model>;

  /**
   * Attribute has to be matched for rows to be selected for the given action.
   */
  where?: FilterQuery<Model>;

  /**
   * Specifies an ordering. If a string is provided, it will be escaped. Using an array, you can provide
   * several columns / functions to order by. Each element can be further wrapped in a two-element array. The
   * first element is the column / function to order by, the second is the direction. For example:
   * `order: [['name', 'DESC']]`. In this way the column will be escaped, but the direction will not.
   */
  order?: [string, SortOrder][];

  /**
   * Limits how many items will be retrieved by the operation.
   */
  limit?: number;

  /**
   * Skip the results;
   */
  skip?: number;

  /**
   *  populate
   */
  populate?: PopulateOptions[];
}
