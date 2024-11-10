export class DeleteEntityEvent {
  constructor(public entityType: string, public entityId: string) {}
}
