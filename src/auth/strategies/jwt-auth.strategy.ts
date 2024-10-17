import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    //el constructor configura la estrategia JWT
  constructor(){
    super({
        //extraemos el token 
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        //no ignoramos la expiracion del token 
        ignoreExpiration: false,
        //clave secreta para verificar la firma del token JWT
        secretOrKey: "SECRET"
    });
  }

  //el metodo validate se utiliza para validar el payload del token JWT
  async validate(payload: {sub:any; email: any; rol: any;}){
    //retornan un objeto que contiene las propiedades del payload del token 
    return {sub: payload.sub, email: payload.email, rol: payload.rol};
  }

}