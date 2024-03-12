using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FellaudioApp.Migrations
{
    public partial class UpdStructure5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Points_PreviousPointId",
                table: "Points");

            migrationBuilder.AlterColumn<int>(
                name: "PreviousPointId",
                table: "Points",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Points_PreviousPointId",
                table: "Points",
                column: "PreviousPointId",
                unique: true,
                filter: "[PreviousPointId] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Points_PreviousPointId",
                table: "Points");

            migrationBuilder.AlterColumn<int>(
                name: "PreviousPointId",
                table: "Points",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Points_PreviousPointId",
                table: "Points",
                column: "PreviousPointId",
                unique: true);
        }
    }
}
