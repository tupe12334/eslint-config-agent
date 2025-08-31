// Valid: Class with named union type properties

type StatusType = 'active' | 'inactive' | 'pending';
type VisibilityType = 'public' | 'private' | 'protected';

class ValidClass {
  status: StatusType = 'pending';
  visibility: VisibilityType = 'public';

  setStatus(newStatus: StatusType) {
    this.status = newStatus;
  }

  getVisibility(): VisibilityType {
    return this.visibility;
  }
}

export { ValidClass };