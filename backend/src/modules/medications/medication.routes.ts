export const medicationRoutes = {
  list: 'GET /api/v1/medications',
  listByPetGrouped: 'GET /api/v1/medications/pet/:petId/grouped',
  create: 'POST /api/v1/medications',
  update: 'PATCH /api/v1/medications/:id',
} as const;
