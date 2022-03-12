export interface IRole {
  run(creep: Creep): void;
  roleName: string;
  spawn(spawnerName: string, maxEnergy: number): boolean;
}
