import { Role } from "src/roles/entities/role.entity";
import { ManyToOne, RelationId } from "typeorm";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity("usuarios")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column({default:true})
    isActive: boolean;
    
    @ManyToOne(() => Role)
    role: Role;

    @RelationId((user: User) => user.role)
    roleId: number;


    checkPassword(password: string): boolean{
        return bcrypt.compareSync(password, this.password)
    }

    hashPassword(): void{
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }
}
