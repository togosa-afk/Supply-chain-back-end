import {
	DataTypes,
	Model,
	type CreationOptional,
	type InferAttributes,
	type InferCreationAttributes,
} from 'sequelize'
import sequelize from '../db'

class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
	declare id: CreationOptional<string>
	declare name: string
	declare quantity: number
	declare company_name: string
	declare combany_id: string
	declare min_avalabil_qaun: number
	declare max_avalabil_qaun: number
}

Product.init({
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	company_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	combany_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	min_avalabil_qaun: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	max_avalabil_qaun: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
},
	{
		sequelize,
		modelName: 'Product',
		tableName: 'products',
	}
)

export {Product}
export default Product