export class MemorySearchDto {
  query!: string;
  limit?: number;
  sources?: string;
}

export class MemoryGetDto {
  path!: string;
  startLine?: number;
  numLines?: number;
}
