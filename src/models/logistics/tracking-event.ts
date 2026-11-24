import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import sequelize from "../../db";
import { ShipmentStatus } from "./shipment";

class TrackingEvent extends Model<
  InferAttributes<TrackingEvent>,
  InferCreationAttributes<TrackingEvent>
> {
  declare id: CreationOptional<string>;
  declare shipment_id: string;
  declare status: ShipmentStatus;
  declare location: string;
  declare description: string;
  declare event_at: Date;
  declare created_at: CreationOptional<Date>;
}

TrackingEvent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shipment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "shipments", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ShipmentStatus)),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    event_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "TrackingEvent",
    tableName: "tracking_events",
    timestamps: false,
  },
);

export { TrackingEvent };
export default TrackingEvent;
