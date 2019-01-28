interface IStudent {
  id: string;
  age: number;
}

interface IWorker {
  companyId: string;
}

type IWorkingStudent = IStudent & IWorker;

let person: IWorkingStudent;
person = {
  id: 'PID123',
  age: 5,
  companyId: 'CID01'
};
