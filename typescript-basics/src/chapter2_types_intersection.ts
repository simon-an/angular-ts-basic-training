
interface IStudent {
  id: string;
  age: number;
}

interface IWorker {
  companyId: string;
}

type WorkingStudent = IStudent & IWorker;

let person: WorkingStudent;
person = {
  age: 5,
  companyId: 'CID01',
  id: 'PID123',
};
