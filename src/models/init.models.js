//importaciones de modelos
import { User} from './users.models.js'
import { Rol } from './rules.models.js'

// revisar relaciones
export const initModels = () =>{
    User.hasMany(Rol)
    Rol.belongsTo(User)
}