namespace typesIntersection {
  interface Student {
    id: string;
    age: number;
  }

  interface Worker {
    companyId: string;
  }

  type WorkingStudent = Student & Worker;

  let person: WorkingStudent;
  person = {
    id: 'PID123',
    age: 5,
    companyId: 'CID01'
  };
}
