export interface BaseMapper<Scheme, Entity, RequestInterface = any> {
  convertSchemaToEntity(schema: Scheme): Entity;

  convertEntityToSchema(entity: Entity): Scheme;

  convertRequestToEntity?: (request: Partial<RequestInterface>) => Entity;
}
