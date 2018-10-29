These are the instructions for getting the backend to run:

# Introduction
We use NestJS for that.
https://docs.nestjs.com/

Nest is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with TypeScript (preserves compatibility with pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

Under the hood, Nest makes use of Express, but also provides compatibility with a wide range of other libraries (e.g. Fastify). This allows for easy use of the myriad third-party plugins which are available.

Nest provides an out-of-the-box application architecture which allows for effortless creation of highly testable, scalable, loosely coupled, and easily maintainable applications.

# Installation
```bash
npm i -g @nestjs/cli
nest new backend
```

Start dev server with watch-refresh
```bash
cd backend
npm run start:dev
```

# Excercises
## 1. Create GET Controller for Safe and call it
```bash
nest g controller safes
```
```bash
// Creates
CREATE /src/safes/safes.controller.spec.ts (478 bytes)
CREATE /src/safes/safes.controller.ts (99 bytes)
UPDATE /src/app.module.ts (399 bytes) // Adds SafesController to module
```

Add first method
```typescript
@Get()
findAll() {
  return 'This action returns all safes';
}
```
<details><summary>Additional info @Get</summary>
The @Get() decorator before the findAll() method tells Nest to create an endpoint for this particular route path and map every corresponding request to this handler. Since we've declared a prefix for every route ( safes), Nest will map every /safesGET request to this method.

When a GET request is made to this endpoint, Nest will now return a 200 status code and the serialized JSON response, which in this case just an empty array. Why does that happen? Generally, we distinguish two different approaches to manipulate responses:
</details>

Postman:
1. Create request "safes findAll"
2. Create collection "backend" and select it
3. Enter URL http://localhost:3000/safes

Add specific GET method
```typescript
@Get(':id')
findOne(@Param() params) {
  console.log(params.id);
  return `This action returns a #${params.id} safe`;
}
```

Postman:
1. Duplicate (right click) request "safes findAll"
2. Enter URL http://localhost:3000/safes/1

## 2. Create POST Controller
```typescript
@Post()
create() {
  return 'This action adds a new safe';
}
```
TODO

## 3. Request Payload

<details><summary>Additional Info @Post</summary>
Our previous example of the POST route handler didn't accept any client params. Let's fix this by adding the @Body() argument here.

But first (if you use TypeScript), we need to determine the DTO (Data Transfer Object) schema. A DTO is an object that defines how the data will be sent over the network. We could determine the DTO schema by using TypeScript interfaces, or by simple classes. Surprisingly, we recommend using classes here. Why? Classes are part of the JavaScript ES6 standard, and therefore they represent plain functions. On the other hand, since TypeScript interfaces are removed during the transpilation, Nest can't refer to them. This is important because features such as Pipes enable additional possibilities when they have access to the metatype of the variable.
</details>

### 3.1 Create the CreateSafeDto
1. Create folder "dto" in folder "safes"
2. Create file "create-safe.dto.ts"
```typescript
export class CreateSafeDto {
  readonly id: string;
  readonly name: string;
}
```

### 3.2 Create the Safe interface
1. Create folder "interface" in folder "safes"
2. Create file "safe.interface.ts"
```typescript
export class Safe {
  readonly id: string;
  readonly name: string;
}
```

readonly because we should always try to make our functions as pure as possible.

Use the newly created schema inside the SafesController:
```typescript
@Post()
async create(@Body() createSafeDto: CreateCafeDto) {
  return 'This action adds a new safe';
}
```
## 4. Create a Service
```bash
nest g service safes/safes
```
```bash
// Creates
CREATE /src/safes/safes.service.spec.ts (449 bytes)
CREATE /src/safes/safes.service.ts (89 bytes)
UPDATE /src/app.module.ts (394 bytes) // Writes service to module
```

Add functionality:
```typescript
private readonly safes: Safe[] = [];

create(safe: Safe) {
  this.safes.push(safe);
}

findAll(): Safe[] {
  return this.safes;
}

findOne(id: string): Safe {
  return this.safes.filter(safe => safe.id === id)[0];
}
```

Here's a SafesService, a basic class with one property and two methods. The only new trait is that it uses the @Injectable() decorator. The @Injectable() attaches the metadata, thereby Nest knows that this class is a Nest provider. Notice that there is a Safe interface used above. We didn't mention it because the schema is exactly same as in the CreateSafeDto class which we have created in the previous chapter.

## 5. Use SafesService inside the SafesController
Add constructor and functions
```typescript
constructor(private readonly safesService: SafesService) {}

@Post()
async create(@Body() createSafeDto: CreateSafeDto) {
  this.safesService.create(createSafeDto);
}

@Get()
async findAll(): Promise<Safe[]> {
  return this.safesService.findAll();
}

@Get(':id')
async findOne(@Param('id') id): Promise<Safe | HttpException> {
  const foundSafe = this.safesService.findOne(id);
  if (!foundSafe) {
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
  return foundSafe;
}
```

Postman
1. Duplicate (right click) request "safes findAll"
2. Change to POST Request
3. Enter URL http://localhost:3000/safes
4. Add Body RAW (Select JSON): 
```json
{
	"id": "1",
	"name": "abc"
}
```

TODO next: validate if id is already in the safes array